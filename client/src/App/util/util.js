export function getCookie(name){
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
  };

export function CurrencyFormat( amount ) {
    return '$' + (amount).toFixed(2);
}
