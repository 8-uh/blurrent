
sloth({
    on: document.getElementsByTagName('img'),
    threshold: 100,
    callback: function(element){
      console.log('visible:', element);
      element.src = element.dataset.src;
    }
});
