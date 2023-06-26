import os from 'node:os'

export const osFM = async (query) => {
  const commandArg = query.trim()

  if (commandArg === '--EOL') {
    console.log(JSON.stringify(os.EOL))
    return
  }

  if (commandArg === '--cpus') {
    const allData = os.cpus()
    console.log(`Total CPU: ${allData.length}`)
    allData.map((el) =>
      console.log(`model: ${el.model}\nclock rate: ${el.speed / 1000} GHz`)
    )
    return
  }

  if (commandArg === '--homedir') {
    console.log(os.homedir())
    return
  }

  if (commandArg === '--username') {
    console.log(os.userInfo().username)
    return
  }

  if (commandArg === '--architecture') {
    console.log(os.arch())
    return
  }

  console.log('Invalid input')
}
