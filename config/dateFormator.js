const todayDateIST = () =>{
    return new Date().toLocaleDateString('en-CA', {timeZone: 'Asia/Kolkata'});
}

module.exports = todayDateIST;