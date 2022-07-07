# <ins>Test Cases</ins>

## Autographa 2.0.0

> ### Login Component
> Autographa has 3 types of Login, we are using a single component for these 3 logins with different props. 
Electron has 2 logins (offline and online) and another is Web login.
> - #### <ins>UI test</ins>
> Check whether every UI element is loaded/rendered properly in:
><ol>
><li>Custom Login (CustomLogin.js)</li>
><li>Login component (Login.js)</li>
></ol>
>
> - #### <ins>Unit test</ins>
> Check whether the functions are returning exact values/datas:
><ol>
><li>Login component (Login.js)</li>
><li>Authentication hook (useAuthentication.js)</li>
><li>Core functions (core/Login/..)</li>
> - [x] Test the token hashing function.
></ol>

> ### Signup Component
> - #### <ins>UI test</ins>
> Check whether every UI element is loaded/rendered properly in:
><ol>
><li>Signup component (Signup.js)</li>
></ol>
>
> - #### <ins>Unit test</ins>
> Check whether the functions are returning exact values/datas:
><ol>
><li>Api connection (useApi.js)</li>
></ol>
