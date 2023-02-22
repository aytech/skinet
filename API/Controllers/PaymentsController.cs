using API.Errors;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private const string WebhookSecret = "";
        private readonly IPaymentService paymentService;
        private readonly ILogger<PaymentsController> logger;

        public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger)
        {
            this.paymentService = paymentService;
            this.logger = logger;
        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket?>> CreateOrUpdatePaymentIntent(string basketId)
        {
            var basket = await paymentService.CreateOrUpdatePaymentIntent(basketId);

            if (basket == null)
            {
                return BadRequest(new ApiResponse(400, "Problem with your basket"));
            }
            return basket;
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], WebhookSecret);

            PaymentIntent intent;
            Core.Entities.OrderAggregate.Order? order;

            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    logger.LogInformation("Payment succeeded: ", intent.Id);
                    order = await paymentService.UpdateOrderPaymentSucceeded(intent.Id);
                    if (order != null)
                    {
                        logger.LogInformation("Order updated to payment received: ", order.Id);
                    }
                    break;
                case "payment_intent.payment_failed":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    logger.LogInformation("Payment failed: ", intent.Id);
                    order = await paymentService.UpdateOrderPaymentFailed(intent.Id);
                    if (order != null) {
                        logger.LogError("Payment failed: ", order.Id);
                    }
                    break;
            }

            return new EmptyResult();
        }
    }
}