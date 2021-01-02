# task-manager-app-api
This is a task managing app made for managing your daily tasks. The technologies user are express, node ,mongoDB. 
Tools used are postman, robo3T, mongoDB compass
you can run it in postman the application is deployed on the link 
=>https://mytask-manager-app.herokuapp.com

Different paths of the app:

//first sign in or sign up before adding tasks
FOR USER:
**create user:(POST)
https://mytask-manager-app.herokuapp.com/users
add the user in body/raw e.g
{
"name":"Muhammad Ameen",
"age":"21",
"email":"sheikameen2525@gmail.com",
"password":"ameen12345"
}
**read profile:(GET)
https://mytask-manager-app.herokuapp.com/users/me
**delete user:(DELETE)
https://mytask-manager-app.herokuapp.com/users/me
**update user:(PATCH)
/users/me
add the user attribute you want to update in body/raw e.g
{
"name":"Muhammad Ameen"
}
**upload profile pic:(POST)
/users/me/avatar
choose the profile pic in body/raw
key: avatar(choose file not text)
value: add picture
**logout user:(POST)
/users/logout
**delte profile pic:(DELETE)
/users/me/avatar






FOR TASKS:
**create Task:(POST)
https://mytask-manager-app.herokuapp.com/tasks
Add the task in body/raw e.g
{
    "description":"clean the house",
    "completed":true
}
**read Tasks:(GET)
https://mytask-manager-app.herokuapp.com/tasks?sortBy=createdAt:desc
https://mytask-manager-app.herokuapp.com/tasks?sortBy=createdAt:asc
**read task by id:(GET)
https://mytask-manager-app.herokuapp.com/tasks/{Task_id}
**delete task:(DELETE)
https://mytask-manager-app.herokuapp.com/tasks/{Task_id}
**update task:(PATCH)
/tasks/{task_id}
add the task attribute you want to update in body/raw e.g
{
"completed":"true"
}


