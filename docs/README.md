📢 Use this project, [contribute](https://github.com/{OrganizationName}/{AppName}) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Yext Store Locator

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

The Yext Store Locator app provides a way to bring in loction data from the Yext Live API and create a store locator map, as well as, individual store pages for each location.

## Configuration

### Step 1 - Installing the Yext Store Locator

Using your terminal and [VTEX IO Toolbelt](https://vtex.io/docs/recipes/development/vtex-io-cli-installation-and-command-reference/#command-reference), log in to the VTEX account you are working on and [install](https://vtex.io/docs/recipes/store/installing-an-app) the `vtex.yext-store-locator@0.x` app.

### Step 2 - Defining the app settings

In your VTEX account's admin, perform the following actions:

1. Access the **Apps** section and then **My Apps**.
2. Select the **Yext Store Locator** app box.
3. In the Settings section, enter your **Yext API key**.
4. Save your changes.

### Step 3 - Adding the locations map and store pages

Before performing the following actions, make sure you already are logged into the desired VTEX account and working on a [Developer workspace](https://vtex.io/docs/recipes/development/creating-a-development-workspace/).

1. Open your Store Theme app in your code editor.
2. Add the `yext-store-locator` app as a `peerDependency` in your theme's `manifest.json` file:

```diff
 "peerDependencies": {
+  "vtex.yext-store-locator": "0.x"
 }
```

| Store page           | Description                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `store.storelocator` | Provides a listing of your store locations along with a map and markers for the store locations |
| `store.storedetail`  | A context component that provides data for an individual store page's child blocks.             |

### Step 4 - Declaring the pages' blocks

The Yext Store Locator app provides the following blocks for your use:

| Block name               | Description                                                                                                                                                                                        |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `store-address`          | Show the store address                                                                                                                                                                             |
| `store-back-link`        | Display a link to navigate back to the store locator map                                                                                                                                           |
| `store-brands`           | Show a list of brands available at the store                                                                                                                                                       |
| `store-conditional`      | A wrapper component that will only render its child blocks if the passed in custom data prop returns content. Used in cases where custom data may be used in some locations, but absent in others. |
| `store-contact`          | Show store contact information.                                                                                                                                                                    |
| `store-custom-data`      | Show a custom data field from your Yext location                                                                                                                                                   |
| `store-description`      | Show the store description                                                                                                                                                                         |
| `store-group`            | A context component that provides data for the store page's child blocks.                                                                                                                          |
| `store-hours`            | Show the store hours. .                                                                                                                                                                            |
| `store-list`             | List of stores that are displayed on the map.                                                                                                                                                      |
| `store-logo`             | Show the store logo.                                                                                                                                                                               |
| `store-map`              | Map component that displays markers for each store in the `store-list`                                                                                                                             |
| `store-nearby-locations` | Used on the store page to display nearby stores.                                                                                                                                                   |
| `store-open-banner`      | Banner to display the open until time for the current day.                                                                                                                                         |
| `store-page-banner`      | Banner component that can be customized with store data.                                                                                                                                           |
| `store-payment-options`  | Show the payment options available as the store.                                                                                                                                                   |
| `store-social-links`     | Show the stores social media links.                                                                                                                                                                |
| `store-title`            | Title block that contains the stores name and location.                                                                                                                                            |

### `block-1` props

| Prop name | Type     | Description | Default value |
| --------- | -------- | ----------- | ------------- |
| `XXXXX`   | `XXXXXX` | XXXXXXXX    | `XXXXXX`      |

### `block-2` props

| Prop name | Type     | Description | Default value |
| --------- | -------- | ----------- | ------------- |
| `XXXXX`   | `XXXXXX` | XXXXXXXX    | `XXXXXX`      |

Prop types are:

- `string`
- `enum`
- `number`
- `boolean`
- `object`
- `array`

When documenting a prop whose type is `object` or `array` another prop table will be needed. You can create it following the example below:

- `propName` object:

| Prop name | Type     | Description | Default value |
| --------- | -------- | ----------- | ------------- |
| `XXXXX`   | `XXXXXX` | XXXXXXXX    | `XXXXXX`      |

Remember to also use this Configuration section to **showcase any necessary disclaimer** related to the app and its blocks, such as the different behavior it may display during its configuration.

## Customization

`In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).`

| CSS Handles                    |
| ------------------------------ |
| `addressContainer`             |
| `addressBlock`                 |
| `addressLabel`                 |
| `addressDirectionsContainer`   |
| `addressDirectionsLink`        |
| `backLinkContainer`            |
| `backLink`                     |
| `brandsContainer`              |
| `brandsLabel`                  |
| `brandsList`                   |
| `brandsItem`                   |
| `contactsContainer`            |
| `contactsContact`              |
| `contactsLabel`                |
| `customDataTextContainer`      |
| `customDataTextListContainer`  |
| `customDataTextListLabel`      |
| `customDataTextList`           |
| `customDataTextListItem`       |
| `customDataImageContainer`     |
| `customDataImageListContainer` |
| `customDataImageListItem`      |
| `hoursContainer`               |
| `hoursLabel`                   |
| `hoursRow`                     |
| `hoursDayOfWeek`               |
| `hoursText`                    |
| `logoContainer`                |
| `mapContainer`                 |
| `nearbyLocationsBlock`         |
| `nearbyLocationsTitle`         |
| `nearbyLocationsContainer`     |
| `nearbyLocationsItem`          |
| `nearbyLocationsAddress`       |
| `nearbyLocationsLinkContainer` |
| `nearbyLocationsLink`          |
| `openBanner`                   |
| `bannerContainer`              |
| `bannerHeader`                 |
| `bannerSubheader`              |
| `paymentOptionsContainer`      |
| `paymentOptionsLabel`          |
| `paymentOptionsText`           |
| `socialLinksBlock`             |
| `socialLinksHeader`            |
| `socialLinksTitle`             |
| `socialLinksSubtitle`          |
| `socialLinksContainer`         |
| `socialLinkTag`                |
| `storeTitle`                   |

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->

---

Check out some documentation models that are already live:

- [Breadcrumb](https://github.com/vtex-apps/breadcrumb)
- [Image](https://vtex.io/docs/components/general/vtex.store-components/image)
- [Condition Layout](https://vtex.io/docs/components/all/vtex.condition-layout@1.1.6/)
- [Add To Cart Button](https://vtex.io/docs/components/content-blocks/vtex.add-to-cart-button@0.9.0/)
- [Store Form](https://vtex.io/docs/components/all/vtex.store-form@0.3.4/)
