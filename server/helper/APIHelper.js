class APIHelper {
    constructor(query, queryStr) {
        this.query = query;  // mongoose query
        this.queryStr = queryStr;  //query string from request (URL)
    }
    search() {
        const keyword = this.queryStr.key
            ? {
                name: {
                    $regex: this.queryStr.key,
                    $options: 'i',
                }
            } : {};
        this.query = this.query.find({ ...keyword });
        return this;
    }
    filter() { }
    pagination() { }
}

export default APIHelper;