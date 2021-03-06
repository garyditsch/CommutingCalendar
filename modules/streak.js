const getStreak = (data) => {
    // console.log('data', data)
    let streak = 1;
    let tempStreak = 1;

    for (let i = 0; i < data.length; i++) {
        if (i + 1 < data.length) {
            const date1 = new Date(data[i].date);
            const date2 = new Date(data[i + 1].date);
            const days = (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)
            if (days === 1 || days === 0) {
                tempStreak = tempStreak + 1
            } else {
                tempStreak = 1
            }
        }
        if (tempStreak > streak) {
            streak = tempStreak
        }
    }        
    return streak
}

export { getStreak }

