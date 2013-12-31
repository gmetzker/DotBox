/**
 * An implementation of the Observer pattern with ordered subscribers and event canceling.
 *
 * @author      Gary Metzker <gmetzker@gmail.com>
 * @version     1.0.0
 * @class       Observer
 * @classdesc   This is an implementation of the Observer or pub/sub pattern.
 *              Consumers subscribe and publish to 'channels' with a channel id.
 *              This implementation has several unique features:
 *
 *              1.  The order of calls to any subscribers can be determined when
 *              the subscription is added.  A subscriber can specify an optional
 *              priority where the larger values indicate that the subscriber
 *              wants to be executed first.  Any subscribers added without a
 *              priority are called last.
 *
 *              2.  Any subscriber can cancel the publish to any lower priority
 *              subscribers if the subscriber sets this.cancel = true in the
 *              callback method.  The publish method will return false if any
 *              subscriber canceled.
 */
Observer = (function () {

    //Constructor
    var Observer;

    Observer = function Observer() {

        if (!(this instanceof Observer)) {
            return new Observer();
        }


        /* @private
         * @member {Object} - An array where each property key is the channel id
         *                    and the propert value is the subscriber.
         */
        this._channelSubscribers = {};

    };

    /**
     * Adds a subscriber to the observer.  You can optionally choose to give
     * it a priority (bigger priorities are called first).  Subscribers with no
     * priority specified are called in order of when they were added.  If there
     * are subscribers with a priority and without, then any priority subscribers
     * are called first followed by non-priority subscribers in the order they
     * were added.
     * @param {string}    channelId - The channel or type of messages that the subscriber wants to observe.
     * @param {function}  callback  - The function to call when receiving messages.
     *                                The function's this parameter will be a
     *                                publishEvent, and give the subscriber the
     *                                ability of inspecting the channelId with
     *                                this.channelId, or canceling the message
     *                                to lower priority subscribers (this.cancel = true).
     * @param {number=}   priority  - An optional value that allows the user to specify
     *                                the order when there are multiple subscribers ,
     *                                where subscribers with larger values are executed first.
     */
    Observer.prototype.subscribe = function subscribe(channelId, callback, priority) {

        var entry,
            channel = this._channelSubscribers[channelId];

        if(isNullOrUndefined(channel)) {
            channel = [];
        }

        if(isNullOrUndefined(priority)) {
            priority = findNextNonPrioritizedCallback(channel);
        }

        entry = {
          priority : priority,
          callback: callback
        };

        channel.push(entry);


        //Resort the list in priority order.
        channel = channel.sort(sortEntries);
        this._channelSubscribers[channelId] = channel;

    };

    /**
     * Removes a subscriber from the observer.
     * @param {string}   channelId  - The channel that the callback is removed from.
     * @param {function} callback   - The callback that is being removed from the channel.
     */
    Observer.prototype.unsubscribe = function unsubscribe(channelId, callback) {

        var i,
            channel = this._channelSubscribers[channelId];

        if(isNullOrUndefined(channel)) {
            return;
        }

        //Iterate channel to look for call back.
        //If found then remove it.
        for(i = 0; i < channel.length; i++ ) {
            if( channel[i].callback === callback) {
                channel.splice(i, 1);
                break;
            }
        }

        // If channel is empty then remove it from _channels.
        if(channel.length === 0) {
            delete this._channelSubscribers[channelId];
        }


    };


    /**
     * Publishes a message to any subscribers on the given channelId.  Can be
     * called with any number of arguments which will be sent to the subscribers.
     * @param   {number} channelId - The id of the channel to publish to.
     * @param   {*=}      arg1     - Optional argument 1.
     * @param   {*=}      arg2     - Optional argument 2.
     * @param   {*=}      arg3     - Optional argument 3, or 4 etc...
     * @returns {boolean}          - True if all subscribers were published to, or
     *                               false if a subscriber canceled.
     */
    Observer.prototype.publish = function publish(channelId) {

        var i,
            that,
            channel,
            args = null;


        if((arguments.length === 0) || isNullOrUndefined(channelId)) {
            throw new Error("channelId argument required.");
        }

        if(arguments.length > 1) {
            //Get all args to apply except the first which is the channelId.
            args = Array.prototype.slice.call(arguments, 1);

        }

        channel = this._channelSubscribers[channelId];

        // Create 'this' object that the subscribers can use when they are called.

        that = {
            channelId: channelId,
            cancel: false
        };

        if(isNullOrUndefined(channel)) {
            return;
        };

        for(i = 0; i < channel.length; i++) {
            channel[i].callback.apply(that, args);

            if(that.cancel) {
                return false;
            }
        }

        return true;


    };


    /**
     * Search for any subscribers that are non-prioritized (their priorities are negative),
     * and returns the next smallest number.
     * @private
     * @param   {subscriber[]} channel
     * @returns {number}                - Returns -1 if there are no non-prioritized
     *                                    subscribers.  Or returns the next smallest
     *                                    number after the smallest non-prioritized
     *                                    subscriber is found.
     */
    function findNextNonPrioritizedCallback(channel) {

        var i,
            len,
            minP = 0;

        if(isNullOrUndefined(channel)) {
            return minP - 1;
        }

        len = channel.length;

        for(i = 0; i < len; i++) {
            if((channel[i].priority < 0) && (channel[i].priority < minP) ) {
                minP = channel[i].priority;
            }
        }

        return minP - 1;

    }

    /**
     * Sorts entries in descending order.
     * @param   {subscriber} a
     * @param   {subscriber} b
     * @returns {number}
     */
    function sortEntries (a, b) {
        return b.priority - a.priority;
    }

    /**
     * Returns true if the value is either undefined or null.  Returns false
     * if the object is something.
     * @param value
     * @returns {boolean}
     */
    function isNullOrUndefined (value) {

        if(value === undefined) {
            return true;
        }

        if(value === null) {
            return true;
        }

        return false;


    };

    return Observer;

}());




/**
 * @typedef  {Object}   subscriber
 * @property {number}   priority    - The priority call order of this subscriber.
 * @property {function} callback    - The subscribers method to call during a publish.
 */

/**
 * @typedef  {Object}  publishEvent
 * @property {boolean} cancel        - True if the subscriber callback wants to
 *                                     cancel the publish to any lower priority subscribers.
 * @property {number}  channelId     - The id that message subscription was published on.
 */





