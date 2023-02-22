using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    public class OrderByPaymentIntentIdSpecification : BaseSpecification<Order>
    {
        public OrderByPaymentIntentIdSpecification(string? paymentIntentId)
            : base(o => paymentIntentId != null && o.PaymentIntentId == paymentIntentId) { }
    }
}