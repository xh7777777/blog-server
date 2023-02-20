const qiniu = require('qiniu')
const { qiniu_config } = require('../config')
// https://blog.csdn.net/weixin_42373488/article/details/124847903?spm=1001.2101.3001.6650.4&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-4-124847903-blog-100603727.pc_relevant_3mothn_strategy_and_data_recovery&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-4-124847903-blog-100603727.pc_relevant_3mothn_strategy_and_data_recovery&utm_relevant_index=8

const uploadToQiniu = (filePath, key) => {
    const ak = qiniu_config.accessKey
    const sk = qiniu_config.secretKey
    const mac = new qiniu.auth.digest.Mac(ak, sk)
    const options = {
        scope: qiniu_config.bucket
    }
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const token = putPolicy.uploadToken(mac)
    const config = new qiniu.conf.Config()
    console.log(qiniu.zone.Zone_z0)
    config.zone = qiniu.zone.Zone_z0
    const localFile = filePath
    const formUploader = new qiniu.form_up.FormUploader(config)
    const putExtra = new qiniu.form_up.PutExtra()
    return new Promise((resolved, reject) => {
        formUploader.putStream(token, key, localFile, putExtra, function (respErr, respBody, respInfo) {
            if (respErr) {
                reject(respErr)
            } else {
                resolved(respBody)
            }
        })
    })
}
module.exports = {uploadToQiniu} 