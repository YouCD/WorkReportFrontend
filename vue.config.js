const VueCliPluginQiniuUploader = require("vue-cli-plugin-qiniu-uploader");
module.exports = {
	//避免eslint报错
	lintOnSave:false,
	configureWebpack: (config) => {
		if (process.env.NODE_ENV === "production") {
			return {
				plugins: [new VueCliPluginQiniuUploader()],
			};
		}
	},
}
