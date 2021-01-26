- Project Name: Foodie Shop
- Start Date: 2020-10
- Github: [#front-end](https://github.com/yangfanfinland/next-mall)
- Github: [#backend-end](https://github.com/yangfanfinland/mall-backend)

# Summary
An e-commerce website aims to bring all kinds of declious snacks to foodies.

# Motivation
Committed to found an unique website with full commerce functionalities. Foodies could purchase different types of snacks around the world.

# Guide-level explanation
- The Foodie Shop is seperation of front-end and backend, containes 3 parts: Customer portal, Shop administrator management platform and Backend server.
- Current project is the Customer portal. 
- This project should have full commerce functionalities, such as user center, products display, shopping cart, payment, i18n etc.

# Reference-level explanation
- Technologies: Typescript, Next.js, Less, Antd design, redux, jest, koa2 and so on.
- Monolithic architecture
- Shopping cart (Cookie -> Redis)

# Rationale and alternatives
- SEO friendly React
- AntD with less, not sass (styled-components)

# Unresolved questions
- Optimize
    - Image (lazy loading, next/image, webp)
    - Big first load js (Antd load on demand, lazy load)
    - Scalable, components reusable highly
- Payment
- Localization

# Future possibilities
- Cluster, Micro-service
- Different business mode