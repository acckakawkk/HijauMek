import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';
import random from 'random';
import chalk from 'chalk';

const DATA_PATH = './data.json';
const AUTHOR_EMAIL = 'tesaccx9@gmail.com';

const displayMessage = (message, type = 'info') => {
  const time = moment().format('HH:mm');
  const messageType = {
    info: chalk.blue,
    success: chalk.green,
    error: chalk.red
  };
  
  console.log(`${chalk.gray(`[ ${time} ]`)} ${messageType[type](message)}`);
};

const generateRandomDate = () => {
  const startYear = 2019;
  const endDate = moment();
  const startDate = moment([startYear]);
  
  return moment(startDate)
    .add(random.int(0, endDate.diff(startDate, 'days')), 'days')
    .format();
};

const createCommit = async (commitNumber) => {
  try {
    const commitDate = generateRandomDate();
    
    const commitData = {
      date: commitDate,
      commit: {
        message: `Commit #${commitNumber} - ${commitDate}`,
        author: AUTHOR_EMAIL,
        branch: 'main'
      }
    };

    await jsonfile.writeFile(DATA_PATH, commitData);
    await simpleGit()
      .add(DATA_PATH)
      .commit(commitData.commit.message, { '--date': commitDate });
    
    displayMessage(`Berhasil commit #${commitNumber}`, 'success');
    return true;
    
  } catch (error) {
    displayMessage(`Gagal commit: ${error.message}`, 'error');
    return false;
  }
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const main = async () => {
  const totalCommits = process.argv[2] || 100;
  let successCount = 0;
  
  displayMessage(
    `Memulai generate ${chalk.yellow(totalCommits)} commit...`,
    'info'
  );

  for (let i = totalCommits; i > 0; i--) {
    const result = await createCommit(i);
    if(result) successCount++;
  }

  displayMessage(`Berhasil Push ${successCount} Commit`, 'success');
  await simpleGit().push();

  await delay(10000);

  displayMessage(`Mengulang proses...`, 'info');
  main();
};

main().catch(error => displayMessage(`ERROR: ${error}`, 'error'));