exports._response = ({ statusCode, res, result }) => {
  if (statusCode === 200 || statusCode === 201) {
    res.status(statusCode).json({ message: "success", data: result });
  } else {
    res.status(statusCode).json({ message: result });
    console.error(">>>ERROR<<<", result);
  }
};
