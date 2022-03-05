$(document).ready(function(){
  let playerScore = 0;

  const styleVar = {
    default: "rgba(128, 71, 226, 0.2)",
    correct: "rgba(71, 226, 130, 0.67)",
    wrong: "rgba(226, 76, 71, 0.67)",
    stats: "#d080ff"
  }

  let started = false,
  questionLock = false,
  questionCount = 0,
  questions;

  $('#btn-start').on('click', async () => {
    if (started) return;
    started = true;

    const amount = $('#questionCount').val(),
    category = $('#category').val();

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

      $('#triviaScreen').stop(true, false).animate({
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

    }
    questionCount++;

    $('.question').each(i => {
      if ($($('.question')[i]).attr('value').toLowerCase() === questionAnswer) {
        $($('.question')[i]).css('backgroundColor', styleVar.correct)
      } else {
        $($('.question')[i]).css('backgroundColor', styleVar.wrong)
      }
    });

    $('#triviaScreen').stop(true, false).delay(750).animate({
      height: 'toggle',
      opacity: 'toggle'
    }, 850, () => {
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
      questionLock = false;

      $('#triviaScreen').stop(true, false).animate({
        height: 'toggle',
        opacity: 'toggle'
      }, 850);

    });
  })
});

/*
 + base
 + style
 + title screen & script fetch
 + trivia screen, style
 + animation, style, script
 + next question + animation, question count, score, script
 - responsive design
 - sounds, end screen (try again(title screen), score, questions index, displays: category, numberofquestions, time)
*/