# Contributing to Glow & Co.

First off, thank you for considering contributing to Glow & Co.! It's people like you that make this tool such a great project.

## Where do I go from here?

If you've noticed a bug or have a question, [search the issue tracker](https://github.com/codewithyuvraj24/nextjs-ecommerce-app/issues) to see if someone else in the community has already created a ticket. If not, go ahead and [make one](https://github.com/codewithyuvraj24/nextjs-ecommerce-app/issues/new)!

## Fork & create a branch

If this is something you think you can fix, then [fork this project](https://help.github.com/articles/fork-a-repo) and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-new-payment-gateway
```

## Get the test suite running

Make sure you have Node.js and PostgreSQL installed. Follow the instructions in the `README.md` to set up the local development environment and database.

## Make your changes

1. Create your feature or bug fix.
2. Ensure your code is properly formatted and passes all linting rules (`npm run lint`).
3. If you've modified the UI, please make sure it looks good on both desktop and mobile.

## Commit your changes

Make sure your commit messages are descriptive and follow conventional commits format:

```sh
git commit -m "feat: add Razorpay webhook handler"
```

## Push and open a Pull Request

Push your branch to your fork and submit a Pull Request.

```sh
git push origin 325-add-new-payment-gateway
```

At this point, you're waiting on us. We'll do our best to review your PR quickly. We may suggest some changes or improvements or alternatives.

Thank you!
