const path = require('path');

const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = prompt => {
  return new Promise((resolve, reject) => {
    rl.question(prompt, resolve)
  })
}

(async () => {
  const nameAnswer = await question('What is your name?')
  console.log(`Nice to meet you, ${nameAnswer}.`)

  const whereAnswer = await question('Where are you from?')
  console.log(`I hear it's nice in ${whereAnswer}.`)

  rl.close()
})()

// using assert passed to the test function that just logs failures
//exports['test that logs all failures'] = function(assert) {
//  assert.equal(2 + 2, 5, 'assert failure is logged')
//  assert.equal(3 + 2, 5, 'assert pass is logged')
//}

//if (module == require.main) require('test').run(exports)

