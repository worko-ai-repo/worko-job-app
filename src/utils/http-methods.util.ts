/**
 * Hypertext Transfer Protocol (HTTP) request method codes.
 * @see {@link https://en.wikipedia.org/wiki/HTTP}
 */
enum HttpMethodCode {
    /**
     * The GET method requests that the target resource transfer a representation of its state. 
     * GET requests should only retrieve data and should have no other effect. (This is also true of some other HTTP methods.) 
     * For retrieving resources without making changes, GET is preferred over POST, as they can be addressed through a URL. 
     * This enables bookmarking and sharing and makes GET responses eligible for caching, which can save bandwidth.
     * The W3C has published guidance principles on this distinction, saying, "Web application design should be informed by the above principles, but also by the relevant limitations."
     */
    GET = 'GET',

    /**
     * The HEAD method requests that the target resource transfer a representation of its state, as for a GET request, but without the representation data enclosed in the response body. 
     * This is useful for retrieving the representation metadata in the response header, without having to transfer the entire representation.
     * Uses include checking whether a page is available through the status code and quickly finding the size of a file (Content-Length).
     */
    HEAD = 'HEAD',

    /**
     * The POST method requests that the target resource process the representation enclosed in the request according to the semantics of the target resource. 
     * For example, it is used for posting a message to an Internet forum, subscribing to a mailing list, or completing an online shopping transaction.
     */
    POST = 'POST',

    /**
     * The PUT method requests that the target resource create or update its state with the state defined by the representation enclosed in the request. 
     * A distinction from POST is that the client specifies the target location on the server.
     */
    PUT = 'PUT',

    /**
     * The DELETE method requests that the target resource delete its state.
     */
    DELETE = 'DELETE',

    /**
     * The CONNECT method requests that the intermediary establish a TCP/IP tunnel to the origin server identified by the request target.
     * It is often used to secure connections through one or more HTTP proxies with TLS.
     */
    CONNECT = 'CONNECT',

    /**
     * The OPTIONS method requests that the target resource transfer the HTTP methods that it supports. 
     * This can be used to check the functionality of a web server by requesting '*' instead of a specific resource.
     */
    OPTIONS = 'OPTIONS',

    /**
     * The TRACE method requests that the target resource transfer the received request in the response body. 
     * That way a client can see what (if any) changes or additions have been made by intermediaries.
     */
    TRACE = 'TRACE',

    /**
     * The PATCH method requests that the target resource modify its state according to the partial update defined in the representation enclosed in the request. 
     * This can save bandwidth by updating a part of a file or document without having to transfer it entirely.
     */
    PATCH = 'PATCH',

}

export default HttpMethodCode;