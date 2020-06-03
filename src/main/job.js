const CronJob = require('cron').CronJob;


const currentJobs = new Map()

const createNewJobs = (jobId, cronTime, onTick, timeZone) => {
    if (currentJobs.has(jobId))
        return null
    const newJob = new CronJob(cronTime, onTick, null, true, timeZone);
    currentJobs.set(jobId, newJob)
    return newJob
}

const getJob = (jobId) => {
    if (!currentJobs.has(jobId)) { return null }
    else { return currentJobs.get(jobId) }
}

module.exports = {
    createNewJobs,
    getJob
};