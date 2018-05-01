# Bash Boutique
The finest node shop in all the land for the gadgets, gizmos, whozits, and whatzits that your heart desires!

Bash Boutique a CLI shop simulator game with two player modes, customer and manager.

## Customer Mode

To play as a customer, enter:

> $ node customer.js

This will bring up a table of the store inventory and prompt you to select an item you're interested in purchasing.

![Customer Menu](/images/customer-menu.png)

Once you've made your selection, you'll be asked how many of that item you'd like to purchase. If Bash Boutique has enough of the item in stock, it will tell you the price of the total number of items and update the store inventory to reflect the new stock quantity. If you've requested too many items for Bash Boutique to fulfill, you will be unable to place your order.

![Buy Books](/images/buy-books.png)

You'll then be asked whether or not you'd like to place another order (default answer is no). If yes, you'll again be prompted to select an item and quantity needed. If not, Bash Boutique presents you with a receipt of your total bill.

![Bill and Updated Inventory](/images/bill.png)

In the example above, the customer has purchased 10 books, 1 golden harp, and 2 nickel mirror. Their bill comes to $6938.44 and the product inventory has been updated from the original stock quantities.

## Manager Mode

To play as a manager, enter:

> $ node manager.js

You will then be presented with 4 options:
* View Products for Sale
* View Low Inventory
* Add to Inventory
* Add New Product

After each action, you can return to this menu by typing `yes` or `enter`.

![Manager Menu](/images/manager-menu.png)

### View Products for Sale

This option brings up the product information (product ID number, product name, category, price, and available stock) for the entire store inventory.

### View Low Inventory

This option brings up the product information for products with 5 or fewer units in stock.

### Add to Inventory

This option allows you to add more units to a product in your inventory. You will be prompted to select an item you would like to add inventory for and then asked to specify the number units you would like to add. Then Bash Boutique will display the updated product information.

### Add New Product

This option allows you to create a new product and add it to your store inventory. You will be prompted to provide a product name, category, price, and initial stock quantity. Then Bash Boutique will display the product information with an automatically generated ID number.

![New Product](/images/add-new-product.png)

## What's in the Box?

Bash Boutique uses the following npm packages:
* [mysql](https://www.npmjs.com/package/mysql)
* [inquirer](https://www.npmjs.com/package/inquirer)
* [cli-table](https://www.npmjs.com/package/cli-table)

To get Bash Boutique running in your own terminal/bash:
1. `git clone` this repository
2. run `npm install` to get all dependencies
3. add your own MySQL user and password credentials to `customer.js` and `manager.js`
4. add the MySQL `boutique_db` database to your local instance. If you use MySQL Workbench, just run the script in the `bashBoutique.sql` file