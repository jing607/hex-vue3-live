<template>
    
    <nav>
        <RouterLink to="/">Home</RouterLink> |
        <RouterLink to="/products">Products</RouterLink> |
        <RouterLink to="/about">About</RouterLink> |
        <RouterLink to="/cart">Cart</RouterLink> |
        <!-- <RouterLink to="/login">Login</RouterLink> | -->
        <RouterLink to="/admin/products">Dashboard</RouterLink> |
    </nav>
    <RouterView />
</template>