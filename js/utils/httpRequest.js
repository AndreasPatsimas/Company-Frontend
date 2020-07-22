export class MyHTTP {
   
    // Make an HTTP GET Request 
    
    async get(url, jwt) {
      const response = await fetch(url, {
        method: 'GET',
        headers: 
        {
          'Content-type': 'application/json',
        }
      });
      const resData = await response.json();
      return resData;
    }
  
  
    // Make an HTTP POST Request
    
    async post(url, data) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      const resData = await response;
      return resData;
    }

     // Make an HTTP PUT Request
  
    async put(url, data, jwt) {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'    ,
        },
        body: JSON.stringify(data)
      });
      
      const resData = await response.json();
      return resData;
    }
  
    // Make an HTTP DELETE Request
  
    async delete(url, jwt) {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        }
      });
  
      const resData = await 'Resource Deleted...';
      return resData;
    }  
}

