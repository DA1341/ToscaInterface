(function(global) {
  function TQLSearch(id, value) {
    //console.log('TQLSearch called with id:', id);
  //console.log('TQLSearch called with value:', value);

    const url = `${RestAPIEndpoint}/${WorkspaceName}/object/${id}/task/search`;
    const payload = [{
      "Name": "tqlString",
      "Value": value,
      "Type": "String"
    }];
    
    return fetch(url, {
      method: 'POST',
       headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // Explicitly request JSON response
        ...headers // Ensure headers are correctly merged
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      console.log('Raw response:', response);
      return response.text().then(text => {
        console.log('Response text:', text);
        if (response.ok && response.headers.get('Content-Type').includes('application/json')) {
          return JSON.parse(text);
        } else {
          throw new Error('Response is not JSON or not OK');
        }
      });
    })
    .then(data => {
      if (data.length === 0) {
        console.log("Not Found");
        return "Not Found";
      } else {
        console.log("UniqueId:", data[0].UniqueId);
        return data[0].UniqueId;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      return null;
    });
  }
  global.TQLSearch = TQLSearch;
})(window);
