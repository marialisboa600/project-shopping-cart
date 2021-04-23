function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// função que cria e adiciona valores e atributos aos elementos para adicionar na section abaixo.
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Cria as sections para cada item que virá da requisição da API - 
// especificando os elementos que estaram dentro da section.
function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// função que cria a lista de produtos da requisição da API 
const createList = (data) => {
   data.forEach((element) => {
   const section = document.querySelectorAll('.items')[0];
   section.appendChild(createProductItemElement(element));
   return section;
  });
  
  // return dados;
};

// faço a requisição para a API do mercado livre como promise
const fetchDataList = () => new Promise((resolve, reject) => {  
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json().then((data) => {
        resolve(data.results);
        console.log(data.results);
        // remove o nome fixo que foi inserido no html ao finalizar a requisição- (loading)
        document.getElementsByClassName('loading')[0].remove();
      })
        .catch((erro) => {
          reject(erro);
        });
    });
});
// Crio referência  a classe a qual irei manipular no localStorage
const itens = () => document.querySelectorAll('.cart__items');
// Adiciono os itens ao localStorage utilizando setItem
const itensStorage = () => {
  itens().forEach((element) => {
  localStorage.setItem('CartItens', element.innerHTML);
  });
};
// Função de remover clicando apenas no item
function cartItemClickListener(event) {
  console.log(event);
  const clicar = event.target;
  clicar.remove();
  itensStorage();
}
// função que cria a lista de itens que são adicionados ao carrinho após o click no botão
// adicionar ao carrinho.
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// função de evento click para ser utilizado na função que removerá itens do
// localStorage
const revomeItensStorage = () => {
  itens().forEach((element) => {
  element.addEventListener('click', cartItemClickListener);
  });
};
// função que mantém os dados salvos no localStorage mesmo ao recarregar
// a página. Utilizando o getItem
const loadStorage = () => {
  itens().forEach((element) => {
  const item = element;
  item.innerHTML = localStorage.getItem('CartItens');
  });
  revomeItensStorage();
};
// função que adiciona o item clicado ao carrinho (pelo Id)
const fetchAdicionar = (itemID) => new Promise((resolve, reject) => {
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then((response) => {
      response.json().then((dados) => {
        const sku = dados.id;
        const name = dados.title;
        const salePrice = dados.price;
        const olElement = document.getElementsByClassName('cart__items')[0];
       olElement.appendChild(createCartItemElement({ sku, name, salePrice }));
       itensStorage();
      resolve(dados);
    })
      .catch((erro) => {
       reject(erro);
    });
  });
 });
// função que remove item do localStorage
 function excluirItem(element) {
  const clicar = element;
  clicar.remove();
  itensStorage();
}
// função que remove todos os itens do carrinho
 function remove(e) {
  const cartItem = e.target.parentNode.querySelectorAll('.cart__item');
  cartItem.forEach((element) => {
  excluirItem(element);
});
}
 
  // evento de click para remover todo os itens do carrinho
 const removeTodosItens = () => {
  const buttonRemove = document.getElementsByClassName('empty-cart')[0];
  buttonRemove.addEventListener('click', remove);
};
// função de evento de click que adiciona pelo id -sku
function addEvento() {
  const buttonElement = document.getElementsByClassName('item__add');
   for (let index = 0; index < buttonElement.length; index += 1) {
    buttonElement[index].addEventListener('click', function (e) {
      const btnEle = e.target.parentNode.getElementsByClassName('item__sku')[0];
    
      return fetchAdicionar(btnEle.innerText);
    });
    }
  }
// função que recebe as funções que são assicronas
const assicronas = async () => {
  createList(await fetchDataList());
  await addEvento();
  await loadStorage();
  await removeTodosItens();
};
// função que recebe funções quqe devem ser executadas ao abrir a página
window.onload = function onload() { 
  assicronas();
};
