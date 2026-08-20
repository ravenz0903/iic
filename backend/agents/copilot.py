import re
import logging
from typing import Dict, Any, List
from services.price_engine import estimate_price, P_BASE
from services.market_intelligence import generate_price_history, calculate_trends, compare_markets

logger = logging.getLogger(__name__)

class AgriCopilot:
    """AI Agricultural Copilot that answers farmer questions using platform data."""
    
    def __init__(self):
        self.intent_patterns = {
            "best_market": [
                r"where.*sell", r"best.*market", r"best.*mandi", r"highest.*price",
                r"sabse.*achha.*daam", r"kahan.*bech", r"best.*place.*sell",
                r"which.*mandi", r"most.*profitable"
            ],
            "price_check": [
                r"what.*price", r"current.*price", r"price.*of", r"how.*much",
                r"kitna.*daam", r"rate.*kya", r"market.*rate", r"aaj.*ka.*bhav"
            ],
            "sell_timing": [
                r"should.*sell.*now", r"wait", r"right.*time", r"when.*sell",
                r"kab.*bech", r"abhi.*bech", r"hold", r"price.*go.*up",
                r"price.*increase", r"trend"
            ],
            "quality_help": [
                r"quality.*low", r"price.*lower", r"why.*less", r"grade",
                r"improve.*quality", r"defect", r"score.*low", r"kyun.*kam"
            ],
            "find_buyers": [
                r"find.*buyer", r"buyer.*above", r"buyer.*willing", r"buyer.*pay",
                r"khariddar", r"who.*buy", r"connect.*buyer"
            ],
            "profit_calc": [
                r"profit", r"net.*earning", r"kitna.*milega", r"how.*much.*earn",
                r"income", r"cost.*transport", r"deduction"
            ],
            "greeting": [
                r"^hi$", r"^hello$", r"^hey$", r"namaste", r"help"
            ]
        }
    
    def ask(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Process a natural language query and return structured response."""
        if context is None:
            context = {
                "produce_type": "wheat",
                "grade": "A", 
                "quality_score": 88.5,
                "quantity_quintals": 10.0,
                "farmer_lat": 28.6139,
                "farmer_lon": 77.2090
            }
        
        intent = self._detect_intent(query)
        logger.info(f"Copilot query: '{query}' -> intent: {intent}")
        
        handler = getattr(self, f"_handle_{intent}", self._handle_unknown)
        return handler(query, context)
    
    def _detect_intent(self, query: str) -> str:
        query_lower = query.lower().strip()
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, query_lower):
                    return intent
        return "unknown"
    
    def _handle_greeting(self, query, ctx):
        return {
            "answer": "Namaste! 🙏 I'm your AI Agricultural Assistant. I can help you with:\n\n• Finding the best market to sell your produce\n• Checking current prices and trends\n• Advising when to sell for maximum profit\n• Finding buyers and calculating net earnings\n\nWhat would you like to know?",
            "intent": "greeting",
            "data_cards": [],
            "suggested_actions": [
                {"label": "Where should I sell?", "action": "ask", "query": "Where should I sell my wheat?"},
                {"label": "Check prices", "action": "ask", "query": "What is the current price of wheat?"},
                {"label": "Should I sell now?", "action": "ask", "query": "Should I sell now or wait?"}
            ]
        }
    
    def _handle_best_market(self, query, ctx):
        markets = compare_markets(ctx["produce_type"], ctx["grade"], ctx["farmer_lat"], ctx["farmer_lon"], ctx["quantity_quintals"])
        best = markets[0] if markets else None
        
        answer = f"Based on your {ctx['produce_type'].title()} (Grade {ctx['grade']}, {ctx['quantity_quintals']} quintals), "
        if best:
            answer += f"I recommend **{best['name']}**.\n\n"
            answer += f"📍 Distance: {best['distance_km']} km\n"
            answer += f"💰 Current Price: ₹{best['current_price']}/qtl\n"
            answer += f"🚛 Transport Cost: ₹{best['transport_cost']}\n"
            answer += f"✅ **Net Earnings: ₹{best['net_earnings']}**\n\n"
            if len(markets) > 1:
                answer += f"Second best option: {markets[1]['name']} (Net: ₹{markets[1]['net_earnings']})"
        
        return {
            "answer": answer,
            "intent": "best_market",
            "data_cards": [{"type": "market_comparison", "data": markets[:3]}],
            "suggested_actions": [
                {"label": "Show on map", "action": "navigate", "screen": "MarketMap"},
                {"label": "Calculate profit", "action": "ask", "query": f"What will be my profit at {best['name']}?" if best else "Calculate my profit"},
                {"label": "Check price trend", "action": "ask", "query": f"What is the price trend for {ctx['produce_type']}?"}
            ]
        }
    
    def _handle_price_check(self, query, ctx):
        # Extract produce type from query if mentioned
        for produce in P_BASE:
            if produce in query.lower():
                ctx["produce_type"] = produce
                break
        
        estimation = estimate_price(ctx["produce_type"], ctx["grade"], ctx["quantity_quintals"], ctx["farmer_lat"], ctx["farmer_lon"])
        history = generate_price_history(ctx["produce_type"], 30)
        trends = calculate_trends(generate_price_history(ctx["produce_type"], 90))
        
        answer = f"**{ctx['produce_type'].title()} Price Analysis:**\n\n"
        answer += f"📊 Estimated Price: **₹{estimation['estimated_price_per_quintal']}/qtl**\n"
        answer += f"📈 Price Range: ₹{estimation['price_range']['min']} - ₹{estimation['price_range']['max']}\n"
        answer += f"📉 7-Day Trend: {trends.get('trend_direction', 'stable').title()} ({trends.get('price_change_7d_pct', 0):+.1f}%)\n"
        answer += f"🎯 AI Confidence: {estimation['confidence']*100:.0f}%\n\n"
        answer += f"For your Grade {ctx['grade']} quality, the price accounts for quality factor ×{estimation['contributing_factors']['quality_multiplier']}"
        
        return {
            "answer": answer,
            "intent": "price_check",
            "data_cards": [
                {"type": "price_estimation", "data": estimation},
                {"type": "price_trend", "data": trends}
            ],
            "suggested_actions": [
                {"label": "Find best market", "action": "ask", "query": f"Where should I sell my {ctx['produce_type']}?"},
                {"label": "View full trends", "action": "navigate", "screen": "MarketIntelligence"},
                {"label": "Compare markets", "action": "navigate", "screen": "MarketMap"}
            ]
        }
    
    def _handle_sell_timing(self, query, ctx):
        history = generate_price_history(ctx["produce_type"], 90)
        trends = calculate_trends(history)
        
        direction = trends.get("trend_direction", "stable")
        change_7d = trends.get("price_change_7d_pct", 0)
        
        if direction == "rising" and change_7d > 3:
            advice = "📈 **Prices are trending UP.** Consider waiting 3-5 days for potentially better returns. However, this comes with the risk of a sudden reversal."
            recommendation = "HOLD"
        elif direction == "falling" and change_7d < -3:
            advice = "📉 **Prices are declining.** I recommend selling soon to avoid further losses. The market has dropped {:.1f}% this week.".format(abs(change_7d))
            recommendation = "SELL NOW"
        else:
            advice = f"➡️ **Prices are relatively stable.** The 7-day change is {change_7d:+.1f}%. This is a reasonable time to sell — no strong signals to wait."
            recommendation = "SELL"
        
        answer = f"**Sell Timing Advisor for {ctx['produce_type'].title()}:**\n\n"
        answer += f"Recommendation: **{recommendation}**\n\n"
        answer += advice + "\n\n"
        answer += f"📊 7-Day Price Change: {change_7d:+.1f}%\n"
        answer += f"📈 30-Day Price Change: {trends.get('price_change_30d_pct', 0):+.1f}%\n"
        answer += f"📉 Market Volatility: {trends.get('volatility', 0)*100:.1f}%"
        
        return {
            "answer": answer,
            "intent": "sell_timing",
            "data_cards": [{"type": "sell_recommendation", "data": {"recommendation": recommendation, "trends": trends}}],
            "suggested_actions": [
                {"label": "Find best market now", "action": "ask", "query": f"Where is the best market for {ctx['produce_type']}?"},
                {"label": "View price history", "action": "navigate", "screen": "MarketIntelligence"},
                {"label": "Estimate my price", "action": "navigate", "screen": "PriceEstimator"}
            ]
        }
    
    def _handle_quality_help(self, query, ctx):
        score = ctx.get("quality_score", 0)
        grade = ctx.get("grade", "C")
        
        if score >= 85:
            insight = "Your quality is excellent! Grade A produce commands the best market prices."
            tips = "• Maintain current storage and handling practices\n• Consider premium buyer channels\n• Your produce qualifies for export markets"
        elif score >= 65:
            insight = f"Your produce scored {score}/100 (Grade B). This is above average but there's room for improvement."
            tips = "• Check for storage-related damage\n• Improve packaging during transport\n• Sort out damaged items before selling\n• Sell within 48 hours for best quality"
        else:
            insight = f"Your quality score is {score}/100 (Grade {grade}). This significantly impacts your selling price."
            tips = "• Separate damaged produce from healthy stock\n• Consider immediate local sale to minimize further quality loss\n• Review harvesting techniques\n• Explore processing options (flour mills, canning) for lower-grade produce"
        
        answer = f"**Quality Analysis:**\n\n{insight}\n\n**Tips to Maximize Value:**\n{tips}"
        
        return {
            "answer": answer,
            "intent": "quality_help",
            "data_cards": [{"type": "quality_insight", "data": {"score": score, "grade": grade}}],
            "suggested_actions": [
                {"label": "Rescan produce", "action": "navigate", "screen": "Scanner"},
                {"label": "View quality report", "action": "navigate", "screen": "QualityReport"},
                {"label": "Find best price for my grade", "action": "ask", "query": f"What price can I get for Grade {grade} {ctx['produce_type']}?"}
            ]
        }
    
    def _handle_find_buyers(self, query, ctx):
        # Extract price threshold if mentioned
        price_match = re.search(r'(\d{1,2},?\d{3})', query)
        min_price = int(price_match.group(1).replace(',', '')) if price_match else 2000
        
        # Generate mock buyer matches
        buyers = [
            {"name": "Delhi Buyer #14", "price": min_price + 310, "distance_km": 82, "reliability": 4.2, "match_pct": 94},
            {"name": "Gurgaon Trader #7", "price": min_price + 180, "distance_km": 45, "reliability": 4.5, "match_pct": 88},
            {"name": "Noida Wholesaler #3", "price": min_price + 250, "distance_km": 60, "reliability": 3.8, "match_pct": 85}
        ]
        
        best = buyers[0]
        answer = f"I found **{len(buyers)} buyers** matching your criteria:\n\n"
        answer += f"🏆 **Best Match: {best['name']}**\n"
        answer += f"   💰 Expected Price: ₹{best['price']}/qtl\n"
        answer += f"   📍 Distance: {best['distance_km']} km\n"
        answer += f"   ⭐ Reliability: {best['reliability']}/5\n"
        answer += f"   🎯 Match: {best['match_pct']}%\n\n"
        for b in buyers[1:]:
            answer += f"• {b['name']} — ₹{b['price']}/qtl, {b['distance_km']}km, ⭐{b['reliability']}\n"
        
        return {
            "answer": answer,
            "intent": "find_buyers",
            "data_cards": [{"type": "buyer_matches", "data": buyers}],
            "suggested_actions": [
                {"label": "Contact best buyer", "action": "navigate", "screen": "BuyerMatch"},
                {"label": "Calculate profit with this buyer", "action": "ask", "query": f"What will be my profit selling to {best['name']}?"},
                {"label": "View all buyers", "action": "navigate", "screen": "Marketplace"}
            ]
        }
    
    def _handle_profit_calc(self, query, ctx):
        markets = compare_markets(ctx["produce_type"], ctx["grade"], ctx["farmer_lat"], ctx["farmer_lon"], ctx["quantity_quintals"])
        best = markets[0] if markets else None
        
        if best:
            gross = best["current_price"] * ctx["quantity_quintals"]
            transport = best["transport_cost"]
            fees = gross * 0.02  # 2% marketplace fee
            loading = 50 * ctx["quantity_quintals"]
            net = gross - transport - fees - loading
            
            answer = f"**Profit Calculation for {ctx['produce_type'].title()}:**\n\n"
            answer += f"📦 Quantity: {ctx['quantity_quintals']} quintals\n"
            answer += f"💰 Selling Price: ₹{best['current_price']}/qtl\n\n"
            answer += f"**Revenue Breakdown:**\n"
            answer += f"  Gross Revenue:     ₹{gross:,.0f}\n"
            answer += f"  - Transport:       ₹{transport:,.0f}\n"
            answer += f"  - Marketplace Fee: ₹{fees:,.0f}\n"
            answer += f"  - Loading/Unload:  ₹{loading:,.0f}\n"
            answer += f"  ━━━━━━━━━━━━━━━━━━━━━\n"
            answer += f"  **Net Income:      ₹{net:,.0f}**"
        else:
            answer = "Unable to calculate profit. Please scan your produce first."
        
        return {
            "answer": answer,
            "intent": "profit_calc",
            "data_cards": [{"type": "profit_breakdown", "data": {"gross": gross, "transport": transport, "fees": fees, "loading": loading, "net": net}}] if best else [],
            "suggested_actions": [
                {"label": "Find better market", "action": "ask", "query": "Where is the best market?"},
                {"label": "Compare transport options", "action": "navigate", "screen": "Logistics"},
                {"label": "List for sale", "action": "navigate", "screen": "CreateListing"}
            ]
        }
    
    def _handle_unknown(self, query, ctx):
        return {
            "answer": f"I'm not sure I understood that. Here's what I can help you with:\n\n• \"Where should I sell my wheat?\" — Find the most profitable market\n• \"What is the current price?\" — Check market prices\n• \"Should I sell now or wait?\" — Get timing advice\n• \"Find buyers above ₹2,300\" — Match with buyers\n• \"Calculate my profit\" — Detailed P&L breakdown\n\nTry asking one of these!",
            "intent": "unknown",
            "data_cards": [],
            "suggested_actions": [
                {"label": "Best market?", "action": "ask", "query": "Where should I sell my produce?"},
                {"label": "Check prices", "action": "ask", "query": "What is the current price of wheat?"},
                {"label": "Sell now?", "action": "ask", "query": "Should I sell now or wait?"}
            ]
        }
    
    def get_proactive_suggestions(self, ctx: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Generate proactive suggestions for the dashboard."""
        if ctx is None:
            ctx = {"produce_type": "wheat", "grade": "A", "quality_score": 88.5, "quantity_quintals": 10.0, "farmer_lat": 28.6139, "farmer_lon": 77.2090}
        
        suggestions = []
        
        # Price trend suggestion
        trends = calculate_trends(generate_price_history(ctx["produce_type"], 90))
        if trends.get("trend_direction") == "rising":
            suggestions.append({"type": "opportunity", "title": f"{ctx['produce_type'].title()} prices rising!", "message": f"Prices up {trends.get('price_change_7d_pct', 0):+.1f}% this week. Good time to explore buyers.", "action": "ask", "query": "Should I sell now?"})
        elif trends.get("trend_direction") == "falling":
            suggestions.append({"type": "warning", "title": "Price decline detected", "message": f"{ctx['produce_type'].title()} prices down {abs(trends.get('price_change_7d_pct', 0)):.1f}%. Consider selling soon.", "action": "ask", "query": "Should I sell now?"})
        
        # Quality-based suggestion
        if ctx.get("quality_score", 0) >= 85:
            suggestions.append({"type": "tip", "title": "Premium quality detected!", "message": "Your Grade A produce qualifies for premium buyers. Let me find the best match.", "action": "ask", "query": "Find premium buyers"})
        
        # Market comparison suggestion
        suggestions.append({"type": "insight", "title": "Market comparison available", "message": f"I found 3 markets near you. Tap to see which gives the best net profit.", "action": "ask", "query": "Compare nearby markets"})
        
        return suggestions
