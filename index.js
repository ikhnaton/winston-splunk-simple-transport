const Transport = require('winston-transport');
const SplunkLogger = require('splunk-logging').Logger;

class SplunkTransport extends Transport
{
	constructor(opts)
	{
		super(opts);
		//
		// Consume any custom options here. e.g.:
		// - Connection information for databases
		// - Authentication information for APIs (e.g. loggly, papertrail,
		//   logentries, etc.).
		//
		this.splunkLogger = new SplunkLogger({
			url: opts.host,
			token: opts.token,
			port: opts.port,
			protocol: opts.protocol
        });
        this.metadata = opts.metadata;
		this.splunkLogger.eventFormatter = (inp) =>
		{
			return this.format.template === undefined
				? inp
				: { message: this.format.template(inp), timestamp: inp.timestamp };
		};
	}

	log(info, callback)
	{
		setImmediate(() =>
		{
            const msgObj = Object.assign(
                {},
                { message: info },
                this.metadata != null ? { metadata: this.metadata } : {},
                info.level != null 
                    ? { severity: info.level } 
                    : info.severity != null 
                        ? { severity: info.severity }  
                        : {}
            );

			this.splunkLogger.send(msgObj, (err, resp, body) =>
			{
				// If successful, body will be { text: 'Success', code: 0 }
				if ((err) || (body.code != 0))
				{
					console.log('error', err);
					console.log("body", body);
				}
				callback(err, resp.body);
			});
		});
	}
}

module.exports = SplunkTransport;