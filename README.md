# Personal portfolio website
Rebuilt with typescript in traditional vanilla manner

## Technologies used
### Development
  - **Typescript**: The website was initially written in untyped javascript and then revamped and rewritten in typescript.  
  - **jQuery**: It is not built upon any of the modern frameworks and uses good old jquery for DOM manipulation.  
  - **SASS**: All the stylesheets are translated from sass preprocessor.  
  - **Netlify functions**: Used as a backend infrastructure for sensitive data management
  
### Bundling
  - **Gulp**: Task runner to run development server and create the production build
  - **Webpack**: Serves for typescript translation and it's bundling
  
  #### Bundling commands
  
  Starts a development server with livereloading
  ```bash
  gulp --dev
  ```  
  
  Creates a production build
  ```bash
  gulp build
  ```
  
### CMS
   - **Notion**: All the dynamic data is fetched through Notion API using Netlify lambda functions
   
### Notice
Website is currently being reworked starting with fresh modern design and ending with development using latest tehnologies.

## License
[CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode)
