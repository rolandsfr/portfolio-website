# Personal portfolio website
My personal portfolio website rebuilt with typescript in traditional vanilla manner

## Technologies used
### Development
  - **Typescript**: The website was initially written in untyped javascript and then revamped and rewritten in typescript.  
  - **jQuery**: It is not built upon any of the modern frameworks and uses good old jquery for DOM manipulation.  
  - **SASS**: All the stylesheets are compiled from sass preprocessor.  
  - **Netlify functions**: Used as a backend infrastructure for sensitive data management
  
### Bundling
  - **Gulp**: Task runner to run development server and create the production build
  - **Webpack**: Serves as a typescript compiler
  
  #### Bunding commands
  
  Starts a development server with livereloading
  ```bash
  gulp --dev
  ```  
  
  Creates a production build
  ```bash
  gulp build
  ```
  
### CMS
   - **Notion**: All the dynamic data is fetched through notion api using sererless functions