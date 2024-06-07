export const getTimeStamp = (timeString:string) => {
    return Math.floor(new Date(timeString).getTime()/1000)
}
