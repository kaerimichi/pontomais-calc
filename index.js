#!/usr/bin/env node

const { readFileSync } = require('fs')
const { get } = require('axios')
const { compute } = require('zaman-statistics-generator')
const { program } = require('commander')
const { safeLoad } = require('js-yaml')
const { prompt } = require('inquirer')
const {
  SERVICE_ENDPOINT = 'https://twa7z12lv8.execute-api.us-east-1.amazonaws.com/prod/history'
} = process.env

async function getMonthPunches (url, token) {
  const { data: response } = await get(
    url,
    { headers: { 'Authorization': `Basic ${token}` } }
  )

  return response
}

program
  .option('-u, --username [username]', 'username or e-mail')
  .option('-f, --from-file [path]', 'corrections file path')
  .option('--use-balance', 'use balance from Pontomais')
  .option('--shift [shift]', 'work hours', '8')
  .action(async () => {
    try {
      let { fromFile: path, username, useBalance, shift: workShift } = program.opts()
      let input = safeLoad(path ? readFileSync(path) : [])
      let serviceResponse
      let monthPunches
      let passwordResp
      let hourBank
      let password
      let token

      if (!username) {
        const usernameResp = await prompt([
          { name: 'username', message: 'Username/E-mail' }
        ])

        username = usernameResp.username
      }

      passwordResp = await prompt([
        { type: 'password', name: 'password', message: 'Password',  }
      ])

      password = passwordResp.password
      token = Buffer.from(`${username}:${password}`).toString('base64')

      serviceResponse = await getMonthPunches(SERVICE_ENDPOINT, token)
      monthPunches = serviceResponse.monthPunches
      hourBank = useBalance ? serviceResponse.hourBank : null

      if (input) {
        monthPunches.forEach(entry => {
          const correction = input.find(e => e.date === parseInt(entry.date.split('-')[2]))

          if (correction) {
            entry.punches = correction.punches
          }
        })
      }

      process.stdout.write(
        JSON.stringify(compute(monthPunches, parseInt(workShift), hourBank), null, 2) + '\n'
      )
      process.exit(0)
    } catch (error) {
      process.stderr.write(`${error}\n`)
      process.exit(127)
    }
  })

program.parse(process.argv)

