const DEFAULT_PAGE_LIMIT = 20;
const MAX_PAGE_LIMIT = 50;


module.exports = {
    sendError,
    getPaginationParams,
    toPaginationData,
    getQuery,
    addQuery
}

function sendError(res, error, status) {

    // 200 è lo stato di default, se non è stato impostato uno stato custom usa quello passato alla funzione
    if (res.statusCode === 200) {
        res.status(status || 500);
    }
    res.send({
        error_name: error.name,
        message: error.message,
    })
    console.error(`[daas] ${error.name} code ${res.statusCode}: ${error.message}\n${error.stack}`);
}

function getPaginationParams(req) {
    let limit = DEFAULT_PAGE_LIMIT;
    let offset = 0;
    if (req.query.limit != undefined) {
        limit = parseInt(req.query.limit);
        limit = Math.min(limit, MAX_PAGE_LIMIT);
        limit = Math.max(limit, 0);
        // 0 <= limit <= MAX_PAGE_LIMIT
    }

    if (req.query.offset != undefined) {
        offset = parseInt(req.query.offset);
        offset = Math.max(offset, 0);
        // offset >= 0
    }
    return { limit, offset };
}

function toPaginationData(countAndRows, limit, offset) {
    return {
        data: countAndRows.rows,
        pagination: {
            limit,
            offset,
            count: countAndRows.rows.length,
            total: countAndRows.count,
            has_next: countAndRows.count > offset + limit,
            has_prev: offset > 0,
        }
    }
}

function getQuery(req) {
    let q = req.query.q || '';
    // if q is an array, take the first element
    if (Array.isArray(q)) {
        q = q[0];
    }
    return q;
}

function addQuery(data, q) {
    if (q) {
        data.q = q;
    }
    return data;
}

