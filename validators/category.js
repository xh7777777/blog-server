function categoryValidator(ctx) {
    ctx.validateBody('name')
      .required('分类 title名字不能为空')
      .isString()
      .trim()
  }
  module.exports = {
    categoryValidator
  }