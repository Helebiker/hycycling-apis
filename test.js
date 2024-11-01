const generateGoalPlan = require('./src/utils/gpt/goalGenerator')

const main = async () => {
 const plan =  await generateGoalPlan({
  userId: '1234',
  goalType: 'endurance',
  goalDuration: 12,
  frequency: 3,
  fitnessLevel: 'intermediate',
  sessionTypes: ['resistance', 'HIIT', 'recovery'],
  durationPerSession: 60,
  priority: 2,
  startDate: new Date().toISOString().split('T')[0]
 })
  console.log(plan)
}


main()