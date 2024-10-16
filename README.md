# Polymorphism Bug in FunC ?

[Alan](https://github.com/alan890104) and I recently experimented with implementing polymorphism in FunC, using a ternary operation to determine which function to execute. However, we encountered a peculiar issue: even though we marked both `sum()` and `mul()` as impure, if the return value of a function is not used, any errors inside the function fail to throw as expected.

This doesn't make much sense because with the impure modifier, the function should throw an error even if its return value isn't used.

Here’s the relevant code:

<img src="https://github.com/user-attachments/assets/85115989-1281-492b-bf92-15064acec926" alt="description" width="500" />


In the main program:

![image](https://github.com/user-attachments/assets/552b869a-dbe1-4bcf-a616-3793b2ba1af5)


When the return value is used (as in the `op::with_dump` case), the error is thrown correctly. However, in the `op::without_dump` case, where the return value is not utilized, the error does not throw, even though the function is marked as impure.

This behavior is puzzling because, theoretically, impure functions should trigger the error regardless of whether their return value is used. We conducted additional tests, such as directly calling the function without using the return value, and in those cases, the error was thrown successfully. (You can find more details in `test.fc`.)


--- 

# Result


<img width="1198" alt="image" src="https://github.com/user-attachments/assets/52e63d57-5691-4856-b346-26f6f1fd4d6c">

---

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

---
