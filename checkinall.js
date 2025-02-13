(function(global) {
  function checkinall() {
    const url = `${RestAPIEndpoint}/${WorkspaceName}/task/CheckInAll?checkincomment=Null`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes

    return fetch(url, {
      method: 'GET',
      headers: headers,
      signal: controller.signal
    })
    .then(response => {
      clearTimeout(timeoutId); // Clear the timeout if the request completes
      console.log('Status Code:', response.status); // Display the status code
      if (response.ok) {
        return response;
      } else {
        throw new Error('Checkin failed');
      }
    })
    .catch(error => {
      if (error.name === 'AbortError') {
        console.error('Request timed out');
      } else {
        console.error('Error:', error);
      }
      throw error;
    });
  }
  global.checkinall = checkinall;
})(window);
