const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch'); // Or Axios if preferred
const extractJSON = require('./extractJSON');
require('dotenv').config();
// Utility function to calculate the deadline based on duration
const calculateDeadline = (durationInWeeks) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + durationInWeeks * 7);
    return currentDate.toISOString().split('T')[0];
};

// Helper function to interact with GPT API
const callGPTAPI = async (prompt, maxTokens = 1500) => {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4', // Or the specific model you are using
                messages: [{ role: 'user', content: prompt }],
                max_tokens: maxTokens
            })
        });
        
        const data = await response.json();
        return extractJSON(data.choices[0].message.content); // Parse GPT JSON response
    } catch (error) {
        console.error('Error calling GPT API:', error);
        throw new Error('Failed to retrieve response from GPT');
    }
};

// Main goal generator function
const generateGoalPlan = async ({
    userId,
    goalType = 'endurance',
    goalDuration = 12, // Default duration in weeks
    frequency = 3, // Days per week
    fitnessLevel = 'intermediate',
    sessionTypes = ['resistance', 'HIIT', 'recovery'],
    durationPerSession = 60, // in minutes
    priority = 2, // Default priority level
    startDate = new Date().toISOString().split('T')[0]
}) => {
    const goalId = uuidv4();
    const deadline = calculateDeadline(goalDuration);
    
    // Construct the prompt to request from GPT
    const prompt = `
        Generate a cycling goal and training session plan in JSON format.
        **User Information:**
        - Goal Type: ${goalType}
        - Goal Duration: ${goalDuration} weeks
        - Training Frequency: ${frequency} days per week
        - Fitness Level: ${fitnessLevel}
        - Session Types: ${sessionTypes.join(', ')}
        - Average Session Duration: ${durationPerSession} minutes

        **Response JSON Format:**
        {
            "goalDescription": "string",
            "deadline": "YYYY-MM-DD",
            "priority": ${priority},
            "sessions": [
                {
                    "type": "string",
                    "duration": integer,
                    "intensity": "string",
                    "date": "YYYY-MM-DD",
                    "status": "pending",
                    "details": "string"
                }
            ]
        }
    `;

    // Call GPT API to get the goal plan
    const gptResponse = await callGPTAPI(prompt);
    
    // Structure the response with additional properties for the database
    const goalPlan = {
        goalId: goalId,
        userId: userId,
        goalDescription: gptResponse.goalDescription || `Goal to improve ${goalType} over ${goalDuration} weeks.`,
        type: goalType,
        duration: goalDuration,
        deadline: gptResponse.deadline || deadline,
        priority: priority,
        sessions: gptResponse.sessions.map(session => ({
            id: uuidv4(),
            type: session.type,
            duration: session.duration,
            intensity: session.intensity,
            date: session.date,
            status: session.status || 'pending',
            details: session.details
        }))
    };

    return goalPlan;
};

module.exports = generateGoalPlan;
