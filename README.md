# range-booking
Playing around with a booking system in angular with a node backend



# Build instructions
Change directory into the spabooking directory and ng-build --prod. This will build the application to the static files folder 

Change directory into api and node index.js. Then navigate to localhost. Alternatively, you can build the docker image and run via a container. 


# Known Issues
The UI is a mess, but for the most parts functional. 
Adding new users doesn't currently work. 

# Next Steps
The Angular app has routing enabled, but doesn't currently use it. As it's being served as static files from the express js server, if an angular route is entered, it wont be recognised. The backend will expect that it is one of the API routes. 