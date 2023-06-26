export const parseArg = () => {
  const stringArg = process.argv.slice(2).join('')

  let username = 'guest'

  if (stringArg.startsWith('--username=')) {
    username = stringArg.slice(11)
    return username
  } 

  return username
}
