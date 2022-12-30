using AutoFixture;
using AutoFixture.Xunit2;
using E_HealthCareApp_FSDProject.Controllers;
using E_HealthCareApp_FSDProject.Controllers.Services.UserService;
using E_HealthCareApp_FSDProject.Data;
using E_HealthCareApp_FSDProject.Models;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackendTest
{
    public class CartControllerTests
    {
        [Test, AutoData]
        public async Task GetAllCartsTestAsync()
        {
            //ARRANGE
            var fixture = new Fixture();
            var contextOptions = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString("N"), b => b.EnableNullChecks(false))
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking).Options;
            var context = new DataContext(contextOptions);
            var cart1 = fixture.Build<Cart>()
                .With(x => x.UserId, 1)
                .With(x => x.ProductId, 10)
                .With(x => x.Quantity, 1)
                .With(x => x.TotalPrice, 50).Create();
            var cart2 = fixture.Build<Cart>()
                .With(x => x.UserId, 10)
                .With(x => x.ProductId, 10)
                .With(x => x.Quantity, 7)
                .With(x => x.TotalPrice, 50).Create();
            context.Carts.Add(cart1);
            context.Carts.Add(cart2);

            var product2 = fixture.Build<Product>()
                .With(x => x.Name, "Product 2")
                .With(x => x.Id, 10).Create();
            context.Products.Add(product2);

            var expected = new List<CartController.CartObject>();
            expected.Add(new CartController.CartObject { name = "Product 2", quantity = 8, price = 100 });

            context.SaveChanges();

            var userService = fixture.Create<Mock<IUserService>>();

            var sut = new CartController(context, userService.Object);

            //ACT
            var response = await sut.GetAllCarts();

            //ASSERT
            var result = (response.Result as dynamic).Value;
            var exp = expected.ToArray();
            exp[0].Should().BeEquivalentTo(result[0]);
        }

        [Test, AutoData]
        public async Task GetCartByIdTestAsync()
        {
            //ARRANGE
            var fixture = new Fixture();
            var contextOptions = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString("N"), b => b.EnableNullChecks(false))
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking).Options;
            var context = new DataContext(contextOptions);
            var cart1 = fixture.Build<Cart>()
                .With(x => x.UserId, 1)
                .With(x => x.ProductId, 10)
                .With(x => x.Quantity, 1)
                .With(x => x.TotalPrice, 50).Create();
            var cart2 = fixture.Build<Cart>()
                .With(x => x.UserId, 10)
                .With(x => x.ProductId, 10)
                .With(x => x.Quantity, 7)
                .With(x => x.TotalPrice, 50).Create();
            context.Carts.Add(cart1);
            context.Carts.Add(cart2);

            var product2 = fixture.Build<Product>()
                .With(x => x.Name, "Product 2")
                .With(x => x.Quantity, 999)
                .With(x => x.Id, 10).Create();
            context.Products.Add(product2);

            var expected = new List<CartController.CartObject>();
            expected.Add(new CartController.CartObject { name = "Product 2", quantity = 7, price = 50 });

            context.SaveChanges();

            var userService = fixture.Create<Mock<IUserService>>();
            userService.Setup(x => x.GetMyId()).Returns("10");

            var sut = new CartController(context, userService.Object);

            //ACT
            var response = await sut.GetCartByUserId();

            //ASSERT
            var result = (response.Result as dynamic).Value;
            var exp = expected.ToArray();
            exp[0].Should().BeEquivalentTo(result[0]);
        }

        [Test, AutoData]
        public async Task AddToCartTestAsync()
        {
            //ARRANGE
            var fixture = new Fixture();
            var contextOptions = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString("N"), b => b.EnableNullChecks(false))
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .EnableSensitiveDataLogging().Options;
            var context = new DataContext(contextOptions);

            var cart1 = fixture.Build<Cart>()
                .With(x => x.UserId, 1)
                .With(x => x.ProductId, 10)
                .With(x => x.Quantity, 1)
                .With(x => x.TotalPrice, 50).Create();
            var cart2 = fixture.Build<Cart>()
                .With(x => x.UserId, 10)
                .With(x => x.ProductId, 10)
                .With(x => x.Quantity, 7)
                .With(x => x.TotalPrice, 50).Create();
            context.Carts.Add(cart1);
            context.Carts.Add(cart2);

            var product2 = fixture.Build<Product>()
                .With(x => x.Name, "Product 2")
                .With(x => x.Quantity, 999)
                .With(x => x.Price, 3)
                .With(x => x.Id, 10).Create();
            context.Products.Add(product2);

            context.SaveChanges();

            var userService = fixture.Create<Mock<IUserService>>();
            userService.Setup(x => x.GetMyId()).Returns("10");

            var sut = new CartController(context, userService.Object);

            //ACT
            var response = await sut.AddToCart(10);

            //ASSERT
            var result = (response.Result as dynamic).Value;
            Assert.AreEqual(result.TotalPrice, 53);
            Assert.AreEqual(result.Quantity, 8);
        }

        [Test, AutoData]
        public async Task RemoveToCartTestAsync()
        {
            //ARRANGE
            var fixture = new Fixture();
            var contextOptions = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString("N"), b => b.EnableNullChecks(false))
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .EnableSensitiveDataLogging().Options;
            var context = new DataContext(contextOptions);

            var cart1 = fixture.Build<Cart>()
                .With(x => x.UserId, 1)
                .With(x => x.ProductId, 10)
                .With(x => x.Quantity, 1)
                .With(x => x.TotalPrice, 50).Create();
            var cart2 = fixture.Build<Cart>()
                .With(x => x.UserId, 10)
                .With(x => x.ProductId, 10)
                .With(x => x.Quantity, 7)
                .With(x => x.TotalPrice, 50).Create();
            context.Carts.Add(cart1);
            context.Carts.Add(cart2);

            var product2 = fixture.Build<Product>()
                .With(x => x.Name, "Product 2")
                .With(x => x.Quantity, 999)
                .With(x => x.Price, 3)
                .With(x => x.Id, 10).Create();
            context.Products.Add(product2);

            context.SaveChanges();

            var userService = fixture.Create<Mock<IUserService>>();
            userService.Setup(x => x.GetMyId()).Returns("10");

            var sut = new CartController(context, userService.Object);

            //ACT
            var response = await sut.RemoveFromCart(10);

            //ASSERT
            var result = (response.Result as dynamic).Value;
            Assert.AreEqual(result.TotalPrice, 47);
            Assert.AreEqual(result.Quantity, 6);
        }
    }
}