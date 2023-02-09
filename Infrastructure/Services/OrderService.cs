using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IGenericRepository<Order> orderRepository;
        private readonly IGenericRepository<DeliveryMethod> deliveryMethodRepository;
        private readonly IGenericRepository<Product> productRepository;
        private readonly IBasketRepository basketRepository;

        public OrderService(
            IGenericRepository<Order> orderRepository, 
            IGenericRepository<DeliveryMethod> deliveryMethodRepository, 
            IGenericRepository<Product> productRepository,
            IBasketRepository basketRepository)
        {
            this.orderRepository = orderRepository;
            this.deliveryMethodRepository = deliveryMethodRepository;
            this.productRepository = productRepository;
            this.basketRepository = basketRepository;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            // 1. Get basket from the repo
            var basket = await basketRepository.GetBasketAsync(basketId);
            // 2. Get items from product repo
            var items = new List<OrderItem>();
            foreach (var item in basket!.Items)
            {
                var productItem = await productRepository.GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem!.Id, productItem.Name, productItem.PictureUrl!);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }
            // 3. Get delivery method from repo
            var deliveryMethod = await deliveryMethodRepository.GetByIdAsync(deliveryMethodId);
            // 4. Calculate subtotal
            var subtotal = items.Sum(item => item.Price * item.Quantity);
            // 5. Create order
            var order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subtotal);
            // 6. TODO: Persist the order
            // 7. Return the order
            return order;
        }

        public Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            throw new NotImplementedException();
        }

        public Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            throw new NotImplementedException();
        }
    }
}