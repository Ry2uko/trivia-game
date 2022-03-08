$(document).ready(function(){
  let playerScore = 0,
  started = false,
  questionLock = false,
  questionCount = 0,
  questions = [],
  chosenCategory = '';

  const styleVar = {
    default: "rgba(128, 71, 226, 0.2)",
    correct: "rgba(71, 226, 130, 0.67)",
    wrong: "rgba(226, 76, 71, 0.67)",
    stats: "#d080ff"
  } 

  const btnClickAudio = new Audio('../assets/sounds/btn_click.mp3'),
  correctAudio = new Audio('../assets/sounds/correct.mp3'),
  wrongAudio = new Audio('../assets/sounds/wrong.mp3'),
  fanfareAudio = new Audio('../assets/sounds/fanfare.mp3'),
  failfareAudio = new Audio('../assets/sounds/failfare.mp3');

  $(document).on('keypress', e => {
    if (e.key !== 'Enter') return;
    console.log($('#titleScreen').css('display'))
    if ($('#titleScreen').css('display') !== 'none') {
      $('#btn-start').click();
      return;
    } else if ($('#endScreen').css('display') !== 'none') {
      $('#btn-tryAgain').click();
      return;
    }

  })

  $('#btn-start').on('click', async () => {
    btnClickAudio.play();
    if (started) return;
    started = true;

    const amount = $('#questionCount').val(),
    category = $('#category').val();
    chosenCategory = $('#category')[0].selectedOptions[0].innerText

    if (amount < 1 || amount > 50) {
      alert('Number of questions can only be between 1 and 50, inclusive.');
      started = false;
      return;
    }

    let apiUrl = `https://opentdb.com/api.php?amount=${amount}&type=multiple&`;

    if (category !== 'any') {
      apiUrl += `category=${category}` 
    }

    const res = await fetch(apiUrl);
    const data = await res.json();
    questions = data.results;

    $('#titleScreen').stop(true, false).animate({
      height: 'toggle',
      opacity: 'toggle'
    }, 850, () => {
      const currQuestion = questions[questionCount],
      questionChoices = [...currQuestion.incorrect_answers];

      questionChoices.splice(Math.floor(Math.random() * 4), 0, currQuestion.correct_answer);

      $('#category-display span').html(currQuestion.category);
      $('#trivia-question').html(currQuestion.question);
      $('.question').each(i => {
        $($('.question')[i])
          .html(questionChoices[i])
          .attr('value', questionChoices[i]);
      });
      $('#score-display').text(playerScore);
      $('#question-count-display').text(`${questionCount+1}/${questions.length}`)

      $('#triviaScreen').css('display', 'block');
      $('#triviaScreen-div').stop(true, false).animate({
        height: 'toggle',
        opacity: 'toggle'
      }, 850);

    });

  });

  $('.question').on('click', function(){
    if (questionLock) return;
    questionLock = true;

    const questionVal = $(this).attr('value').toLowerCase(),
    questionAnswer = questions[questionCount].correct_answer.toLowerCase();    

    if (questionVal === questionAnswer) {
      correctAudio.play();
      playerScore++;

      $('#score-display').css({
        transition: 'color 0.01s',
        color: styleVar.correct
      });
      $('#score-display').text(playerScore);
      setTimeout(() => {
        $('#score-display').css({
          transition: 'color 0.4s',
          color: styleVar.stats
        });
      }, 400);

    } else {
      wrongAudio.play();
    }
    
    questionCount++;

    $('.question').each(i => {
      if ($($('.question')[i]).attr('value').toLowerCase() === questionAnswer) {
        $($('.question')[i]).css('backgroundColor', styleVar.correct)
      } else {
        $($('.question')[i]).css('backgroundColor', styleVar.wrong)
      }
    });
    
    $('#triviaScreen-div')
      .stop(true, false)
      .delay(750)
      .animate({
        height: 'toggle',
        opacity: 'toggle'
      }, 850, () => {
        if (questionCount === questions.length) {
          $('#triviaScreen').css('display', 'none');

          // Just a small detail
          if (questions.length % 2 === 0) {
            (playerScore >= questions.length / 2) 
              ? $('#quot-small-detail').text('!') 
              : $('#quot-small-detail').text('?');
          } else {
            playerScore >= Math.ceil(questions.length / 2)
              ? $('#quot-small-detail').text('!') 
              : $('#quot-small-detail').text('?');
          }

          $('#scoreGot-display').text(`${playerScore} out of ${questions.length}`);
          $('#category-display2 span').html(chosenCategory);
          $('.question').each(i => {
            $($('.question')[i]).css('backgroundColor', styleVar.default);
          })

          setTimeout(() => {
            if (questions.length % 2 === 0) {
              if (playerScore >= questions.length / 2) {
                fanfareAudio.play();
                return;
              } 
            } else {
              if (playerScore >= Math.ceil(questions.length / 2)) {
                fanfareAudio.play();
                return
              }
            }

            failfareAudio.play();
          }, 500);
         

          $('#endScreen').stop(true, false).animate({
            height: 'toggle',
            opacity: 'toggle'
          }, 850);
          
          return;
        }

        const currQuestion = questions[questionCount],
        questionChoices = [...currQuestion.incorrect_answers];

        questionChoices.splice(Math.floor(Math.random() * 4), 0, currQuestion.correct_answer); // Random place in multiple choice

        $('#category-display span').html(currQuestion.category);
        $('#trivia-question').html(currQuestion.question);
        $('.question').each(i => {
          $($('.question')[i])
            .css('backgroundColor', styleVar.default)
            .html (questionChoices[i])
            .attr('value', questionChoices[i]);
        });
        $('#question-count-display').text(`${questionCount+1}/${questions.length}`)

        $('#triviaScreen-div').stop(true, false).animate({
          height: 'toggle',
          opacity: 'toggle'
        }, 850, () => {
          questionLock = false;
        });
      });
  })

  $('#btn-tryAgain').on('click', function(){
    btnClickAudio.play();
    started = false, 
    questionLock = false,
    questionCount = 0,
    playerScore = 0,
    questions = [];

    setTimeout(() => {
      $('#endScreen').stop(true, false).animate({
        height: 'toggle',
        opacity: 'toggle'
      }, 850, () => {
        $('#titleScreen').stop(true, false).animate({
          height: 'toggle',
          opacity: 'toggle'
        }, 850);
      });
    }, 750);
  });

});