export class MyHTTP {
   
    // Make an HTTP GET Request 
    
    async get(url, jwt) {
      const response = await fetch(url, {
        method: 'GET',
        headers: 
         {
          'Content-type': 'application/json',
          'Authorization': `Tasos ${jwt}`,
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
  
      const resData = await response.json();
      return resData;
    }

    async authenticatedPost(url, data, jwt) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'    ,
          'Authorization': 'Tasos ' + jwt
        },
        body: JSON.stringify(data)
      });
  
      const resData = await response.json();
      return resData;
    }

  
     // Make an HTTP PUT Request
  
    async put(url, data, jwt) {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'    ,
          'Authorization': 'Tasos ' + jwt
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
          'Content-type': 'application/json'    ,
          'Authorization': 'Tasos ' + jwt
        }
      });
  
      const resData = await 'Resource Deleted...';
      return resData;
    }
  

       // File Handling
   
      async upload(url, data, jwt) {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': 'Tasos ' + jwt
          },
          body: data
        });

        const resData = await response.json();
        return resData;
      }

      async download(url, jwt) {
        const response = await fetch(url, {
          method: 'GET',
          headers: 
           {
            'Authorization': `Tasos ${jwt}`,
          }
        });
        const resData = await response.blob();
        return resData;
      }

   }

