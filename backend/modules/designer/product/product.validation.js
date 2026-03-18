const isEmpty = (val) =>
  val === undefined || val === null || val === "";

exports.validateCreateProduct = (data) => {
  const errors = [];

  if (isEmpty(data.title)) errors.push("Title is required");
  if (isEmpty(data.description)) errors.push("Description is required");
  if (isEmpty(data.price)) errors.push("Price is required");
  if (data.price && data.price <= 0)
    errors.push("Price must be greater than 0");

  if (isEmpty(data.category)) errors.push("Category is required");

  return errors;
};

exports.validateUpdateProduct = (data) => {
  const errors = [];

  if (data.price && data.price <= 0)
    errors.push("Price must be greater than 0");

  return errors;
};
