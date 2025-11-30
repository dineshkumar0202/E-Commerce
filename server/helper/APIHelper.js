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
    filter() {
        const queryCopy = { ...this.queryStr }; // create a copy of the query string
        const removeFields = ['key', 'page', 'limit']; // fields to remove from the query
        removeFields.forEach(key => delete queryCopy[key]); // remove unwanted fields
        this.query = this.query.find(queryCopy); // update the query
        return this; // return the instance for chaining 
    }
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page || 1);
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

export default APIHelper;