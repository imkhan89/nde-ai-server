export function success(res, data) {

  res.json({
    success: true,
    data
  })

}

export function failure(res, message, status = 400) {

  res.status(status).json({
    success: false,
    error: message
  })

}
