using System.Security.Claims;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService orderService;
        private readonly IMapper mapper;
        public OrdersController(IOrderService orderService, IMapper mapper)
        {
            this.orderService = orderService;
            this.mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();
            var address = mapper.Map<AddressDto, Address>(orderDto.ShipToAddress!);
            var order = await orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId, orderDto.BasketId!, address);

            if (order == null)
            {
                return BadRequest(new ApiResponse(400, "Problem creating order"));
            }

            return Ok(order);
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Order>>> GetOrdersForUser()
        {
            return Ok(await orderService.GetOrdersForUserAsync(User.RetrieveEmailFromPrincipal()));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrderByIdForUser(int id)
        {
            var email = User.RetrieveEmailFromPrincipal();
            var order = await orderService.GetOrderByIdAsync(id, email);
            if (order == null)
            {
                return NotFound(new ApiResponse(404));
            }
            return Ok(order);
        }

        [HttpGet("delivery/methods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            return Ok(await orderService.GetDeliveryMethodsAsync());
        }
    }
}