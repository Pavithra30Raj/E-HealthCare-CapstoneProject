using AutoFixture;
using AutoFixture.Xunit2;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;
using E_HealthCareApp_FSDProject;
using E_HealthCareApp_FSDProject.Controllers;
using E_HealthCareApp_FSDProject.Controllers.Services.UserService;
using E_HealthCareApp_FSDProject.Data;
using E_HealthCareApp_FSDProject.DTOs;
using E_HealthCareApp_FSDProject.Models;
using System;
using System.Threading.Tasks;
using FluentAssertions;
using System.Collections.Generic;

namespace BackendTest
{
    public class OrderControllerTests
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
            var order = fixture.Build<Order>().Create();
            
            context.Orders.Add(order);

            context.SaveChanges();

            var userService = fixture.Create<Mock<IUserService>>();
            
            var sut = new OrderController(context, userService.Object);

            //ACT
            var response = await sut.GetAllOrders();

            //ASSERT
            response.Should().NotBeNull();
            var result = (response.Result as dynamic).Value;
            Assert.AreEqual(result[0].Id, order.Id);
        }

        [Test, AutoData]
        public async Task GetOrderByIdTestAsync()
        {
            //ARRANGE
            var fixture = new Fixture();
            var contextOptions = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString("N"), b => b.EnableNullChecks(false))
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking).Options;
            var context = new DataContext(contextOptions);
            var order = fixture.Build<Order>()
                .With(x => x.UserId, 10).Create();

            context.Orders.Add(order);

            context.SaveChanges();

            var userService = fixture.Create<Mock<IUserService>>();
            userService.Setup(x => x.GetMyId()).Returns("10");

            var sut = new OrderController(context, userService.Object);

            //ACT
            var response = await sut.GetOrderByUserId();

            //ASSERT
            response.Should().NotBeNull();
            var result = (response.Result as dynamic).Value;
            Assert.AreEqual(result[0].Id, order.Id);
        }

        [Test, AutoData]
        public async Task BuyCartContentTestAsync()
        {
            //ARRANGE
            var fixture = new Fixture();
            var contextOptions = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString("N"), b => b.EnableNullChecks(false))
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking).Options;
            var context = new DataContext(contextOptions);
            var order = fixture.Build<Order>()
                .With(x => x.UserId, 10).Create();
            context.Orders.Add(order);

            var cart = fixture.Build<Cart>()
                .With(x => x.UserId, 10)
                .With(x => x.ProductId, 10)
                .With(x => x.Quantity, 10)
                .With(x => x.TotalPrice, 420).Create();
            context.Carts.Add(cart);

            var account = fixture.Build<Account>()
                .With(x => x.Id, 10)
                .With(x => x.Funds, 123456).Create();
            context.Accounts.Add(account);

            var product = fixture.Build<Product>()
                .With(x => x.Name, "Product")
                .With(x => x.Quantity, 999)
                .With(x => x.Price, 42)
                .With(x => x.Id, 10).Create();
            context.Products.Add(product);

            context.SaveChanges();

            var userService = fixture.Create<Mock<IUserService>>();
            userService.Setup(x => x.GetMyId()).Returns("10");

            var sut = new OrderController(context, userService.Object);

            //ACT
            var response = await sut.GetOrderByUserId();

            //ASSERT
            response.Should().NotBeNull();
            var result = (response.Result as dynamic).Value;
            Assert.AreEqual(result[0].Id, order.Id);
        }
    }
}