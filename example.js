d3.csv("https://gist.githubusercontent.com/garyditsch/beb02ef6a73f69d65707eee6c3cd128b/raw/commuting_data.csv")
.then(text => {
    console.log(text)
    // const data = text.data; // array of dates and values
    // console.log(data)
})
.catch(error => {
    console.error(error);
});