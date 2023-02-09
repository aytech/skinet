using Core.Entities.OrderAggregate;

namespace API.Dtos
{
    public class OrderToReturnDto
    {
        public int Id { get; set; }
        public string? BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; }
        public Address? ShipToAddress { get; set; }
        public string DeliveryMethod { get; set; } = default!;
        public decimal ShippingPrice { get; set; }
        public IReadOnlyList<OrderItemDto> OrderItems { get; set; } = default!;
        public decimal SubTotal { get; set; }
        public decimal Total { get; set; }
        public string? Status { get; set; }
    }
}