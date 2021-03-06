const Validator = require('async-validator').default;
// console.log(Validator)
// 这里的控制器实例会一直存在，option里的数据必须是只读的
class Controller { 
	constructor({ path, method = 'get', handler, rules, option={} }) {
		this.path = path;
		this.method = method;
		this.handler = handler;
		// this.rules = rules;
		if (rules) {
			this.validator = new Validator(rules);
		}
		this.option = option;
	}
	async validate(ctx, next) {
		if (this.validator) {
			const result = await this.validator.validate(ctx.request.body).catch(({ errors, fields }) => errors);
			console.log(result);
			if (!result) {
				await next();
			} else {
				ctx.body = { status: 0, msg: result[0].message };
			}

		} else {
			await next();
		}
	}
}
module.exports = Controller;